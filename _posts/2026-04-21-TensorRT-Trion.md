---
layout: post
title: "A Deep Dive into TensorRT & Triton for Production Inference"
date: 2026-04-20 15:09:00
description: "NVIDIA'S AI Model optimization & Training: A Deep Dive into TensorRT & Triton for Production Inference"
tags: AI-Inference
categories: AI-Inference
featured: false
---

### Introduction

So you've trained your model. Validation loss looks great, accuracy is solid, and you're feeling good. Then someone asks: "Can we deploy this to production?"

And suddenly, latency matters. Throughput matters. GPU bills matter.

This is where TensorRT and Triton Inference Server become essential. Together, they form NVIDIA's complementary toolkit for moving your trained model from a local prototype to a production ready system capable of handling thousands of requests per second. In this post, we will take a closer look at how that process works.

### The Big Picture: Train → Optimize → Serve

```
[PyTorch / TensorFlow]     [TensorRT]             [Triton]
  Train a model    →       Optimize it    →   Serve it at scale
 (Accuracy focus)         (Speed focus)       (Production focus)
```

Step 1: Export the trained model (The Starting Point)
Most of us are familiar with training model using frameworks like [PyTorch](https://pytorch.org) or [TensorFlow](tensorflow.org), leveraging CUDA and cuDNN under the hood for GPU acceleration. Once training is done, we export our model — typically to [ONNX](https://onnx.ai) format, which acts as a universal bridge between deep learning frameworks.

```python

# Export your trained PyTorch model to ONNX
dummy_input = torch.randn(1, 3, 224, 224).cuda()

torch.onnx.export(
    model,                    # Your trained model
    dummy_input,              # Example input for tracing
    "model.onnx",             # Output file
    opset_version=17,         # ONNX opset version
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={            # Allow variable batch sizes
        "input": {0: "batch_size"},
        "output": {0: "batch_size"}
    }
)
```

Why ONNX? It decouples your model from the training framework. TensorRT can then ingest it regardless of whether you trained in PyTorch, TensorFlow, or JAX.

That ONNX file is your handoff point. Now the real fun begins.

### Step 2: Optimization with TensorRT

At its core, TensorRT takes your ONNX model and rebuilds it as a highly optimized inference engine specifically tuned for your GPU. Here's what it actually does under the hood:

**Layer Fusion**

Our model, as exported, runs operations sequentially. A typical ResNet block might look like:

```
Conv2D → BatchNorm → ReLU →  Conv2D →  BatchNorm →  ReLU
  ↓          ↓         ↓       ↓          ↓         ↓
kernel1   kernel2   kernel3  kernel4   kernel5   kernel6
```

Each operation is a separate GPU kernel call. Thus, separate memory reads, writes, and kernel launch overhead. TensorRT fuses these into fewer, larger kernels:

```
[Conv2D + BatchNorm + ReLU] → [Conv2D + BatchNorm + ReLU]
          ↓                               ↓
        kernel1                        kernel2
```

Fewer kernel launches, fewer memory round-trips, significantly faster execution.

**Precision Calibration (INT8 & FP16)**

By default, models run in FP32. TensorRT drops to FP16 or even INT8 with minimal accuracy loss:

- FP16: Usually a free ~2x speedup with negligible accuracy impact
- INT8: Up to ~4x speedup, requires a calibration dataset to determine optimal scaling factors

```python
config = builder.create_builder_config()

# FP16 - easy win, almost always safe
config.set_flag(trt.BuilderFlag.FP16)

# INT8 - needs calibration
config.set_flag(trt.BuilderFlag.INT8)
config.int8_calibrator = MyCalibrator(calibration_dataset)
```

TensorRT's INT8 calibration works by running a small representative dataset through the model and computing the optimal quantization ranges per layer, automatically. We don't need to manually quantize anything.

**Kernel Auto-Tuning**

For any given operation, there are often dozens of possible CUDA kernel [implementations](https://docs.pytorch.org/tutorials/recipes/torch_compile_user_defined_triton_kernel_tutorial.html). TensorRT benchmarks them all at engine build time and picks the fastest one for your specific GPU and input shape. This is why building a TensorRT engine takes a few minutes. It's doing real benchmarking work upfront so inference is as fast as possible at runtime.

**Memory Planning**
TensorRT pre-analyzes the entire computation graph and plans optimal memory reuse across layers. Tensors that are no longer needed get their memory reclaimed immediately for subsequent layers. This reduces peak memory usage significantly, which is important when we are running multiple models on the same GPU.

### Building the Engine

Putting it all together:

```python
import tensorrt as trt

logger = trt.Logger(trt.Logger.WARNING)
builder = trt.Builder(logger)
network = builder.create_network(
    1 << int(trt.NetworkDefinitionCreationFlag.EXPLICIT_BATCH)
)
parser = trt.OnnxParser(network, logger)

# Parse ONNX model
with open("model.onnx", "rb") as f:
    parser.parse(f.read())

# Configure optimization
config = builder.create_builder_config()
config.set_memory_pool_limit(trt.MemoryPoolType.WORKSPACE, 4 << 30)  # 4GB
config.set_flag(trt.BuilderFlag.FP16)

# Set dynamic shape profile
profile = builder.create_optimization_profile()
profile.set_shape(
    "input",
    min=(1, 3, 224, 224),     # Minimum batch size
    opt=(16, 3, 224, 224),    # Optimal batch size
    max=(64, 3, 224, 224)     # Maximum batch size
)
config.add_optimization_profile(profile)

# Build & save engine (this takes a few minutes)
serialized_engine = builder.build_serialized_network(network, config)
with open("model.plan", "wb") as f:
    f.write(serialized_engine)

print(" TensorRT engine built and saved!")
```

⚠️ Important: TensorRT engines are GPU-specific. An engine built on an A100 won't run on a T4. Always engine be built on the same GPU class used in production.

### Step 3: Serving with Triton (The Production Layer)

WE now have a blazing-fast TensorRT engine. But a `.plan` file sitting on disk doesn't serve HTTP requests, handle concurrent users, or scale across multiple GPUs. That's Triton's job.

**Setting Up the Model Repository**
Triton uses a simple directory structure:

```
model_repository/
└── resnet50/
├── config.pbtxt ← Model configuration
└── 1/
└── model.plan ← TensorRT engine
```

**Configuring Triton (config.pbtxt)**

```
name: "resnet50"
backend: "tensorrt"
max_batch_size: 64

input [
  {
    name: "input"
    data_type: TYPE_FP16
    dims: [3, 224, 224]
  }
]

output [
  {
    name: "output"
    data_type: TYPE_FP16
    dims: [1000]
  }
]

dynamic_batching {
  preferred_batch_size: [8, 16, 32, 64]
  max_queue_delay_microseconds: 500
}

instance_group [
  {
    count: 2          # Run 2 model instances concurrently
    kind: KIND_GPU
    gpus: [0]         # On GPU 0
  }
]
```

**Throughput multipliexing with Dynamic Batching**

This is one of Triton's killer features. Instead of processing requests one by one (wasting GPU parallelism) or waiting for a fixed batch (adding latency), Triton dynamically groups incoming requests into batches at runtime.

```
t=0ms    Request A arrives  → queue: [A]
t=0.2ms  Request B arrives  → queue: [A, B]
t=0.3ms  Request C arrives  → queue: [A, B, C]
t=0.5ms  Timer expires      → Batch [A, B, C] → GPU 🚀
```

```
t=0.6ms  Requests D,E,F,G arrive → preferred size (4) hit!
         → Batch [D, E, F, G] → GPU immediately 🚀
```

**Launching Triton**

```bash
docker run --gpus all --rm \
  -p 8000:8000 \ # HTTP/REST
  -p 8001:8001 \ # gRPC (lower overhead, preferred for high-throughput)
  -p 8002:8002 \ # Prometheus metrics
  -v $(pwd)/model_repository:/models \
  nvcr.io/nvidia/tritonserver:24.01-py3 \
  tritonserver --model-repository=/models
```

**Sending Inference Requests**

```python
import tritonclient.http as httpclient
import numpy as np

client = httpclient.InferenceServerClient("localhost:8000")

# Check server health
assert client.is_server_live(), "Triton server is not running!"

# Prepare input
input_data = np.random.rand(1, 3, 224, 224).astype(np.float16)
inputs = [httpclient.InferInput("input", input_data.shape, "FP16")]
inputs[0].set_data_from_numpy(input_data)

outputs = [httpclient.InferRequestedOutput("output")]

# Run inference
response = client.infer("resnet50", inputs, outputs=outputs)
predictions = response.as_numpy("output")

print(f"Output shape: {predictions.shape}")  # (1, 1000)
```

**Key Takeaways**

If you take nothing else from this post, remember these three things:

1. TensorRT is GPU-specific — always build your engine on the same GPU class you'll deploy on. It's not portable, but that's exactly why it's so fast.

2. FP16 is almost always a free win. Enable it by default. Only reach for INT8 if you need that extra push and are willing to validate accuracy carefully.

3. Triton's dynamic batching is a throughput multiplier — tune `preferred_batch_size` and `max_queue_delay_microseconds` based on your latency SLA and expected traffic patterns.
