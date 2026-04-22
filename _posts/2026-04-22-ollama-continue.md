---
layout: post
title: "Local coding assistant with Ollama and VS Code Continue plugin"
date: 2026-04-21 15:09:00
description: "Setting up  Ollama and VS Code Continue plugin for local coding assistance"
tags: AI-Inference
categories: AI-Inference, Local-LLMs, Ollama
featured: false
---

### Introduction

Privacy concerns have long been a primary reason for my reluctance in adopting Copilot. However, recently, the substantial productivity boost I've experienced has convinced me to use it extensively. Nevertheless, privacy concerns still persist. Fortunately, I've found a solution: running the model locally using [Ollama](https://docs.ollama.com/) for serving and the [VS Code Continue plugin](https://marketplace.visualstudio.com/items?itemName=Continue.continue). I will describe my local coding assistance setup in this blog post.

At home, I have a desktop machine running Ubuntu headless equipped with an Nvidia RTX 3090 GPU. My plan is to run the LLM on this machine and access it from my laptops.
First, I installed ollama following the [official documentation](https://docs.ollama.com/quickstart).

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

The installation was fast and smooth. By default, ollama server only for localhost. I enabled remote request for ollama.

```
$ sudo SYSTEMD_EDITOR=vim systemctl edit ollama.service
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"


$ sudo systemctl daemon-reload
$ sudo systemctl restart ollama.service
```

To check if the edit worked:

```
sudo systemctl show ollama.service | grep Environment

# should see OLLAMA_HOST=0.0.0.0:11434
```

Now, the fun begins. let's run a model. Ollama runs a model with just one command:

```bash
ollama run qwen2.5-coder:7b
```

A quick check in the [Huggingface Big Code Models leaderboard](https://huggingface.co/spaces/bigcode/bigcode-models-leaderboard) showed [Qwen2.5-Coder-32B-Instruct](https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct) as the winner. The quantized version of the model needs around 21 GB of VRAM and, indeed, it fits my GPU. However, after a short trial, it was clear that this model is too big to be used as a coding agent locally. Sometimes the Continue plugin completely froze (more on that later). So I opted for the smaller variant of the same model. `ollama run` pulls the model, launches it, and opens a chat interface once the launch succeeds.

```bash
$ ollama run qwen2.5-coder:7b
pulling manifest
pulling 60e05f210007: 100% ▕████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████▏ 4.7 GB
pulling 66b9ea09bd5b: 100% ▕████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████▏   68 B
pulling 1e65450c3067: 100% ▕████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████▏ 1.6 KB
pulling 832dd9e00a68: 100% ▕████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████▏  11 KB
pulling d9bb33f27869: 100% ▕████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████▏  487 B
verifying sha256 digest
writing manifest
success
>>> Hello
Hello! How can I assist you today? Is there something specific you would like to know or discuss? Feel free to ask me anything.

>>> Send a message (/? for help)
```

Now that the model is running on the headless server, let's check if I can access it from my laptop.

```bash
# port forwaring on my laptop
ssh -L 11434:localhost:11434 arul@ubuntu-headless


# check if REST APIs work
curl http://localhost:11434/api/tags | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   684  100   684    0     0  12111      0 --:--:-- --:--:-- --:--:-- 12214
{
  "models": [
    {
      "name": "qwen2.5-coder:7b",
      "model": "qwen2.5-coder:7b",
      "modified_at": "2026-04-22T16:52:36.841474848Z",
      "size": 4683087561,
      "digest": "dae161e27b0e90dd1856c8bb3209201fd6736d8eb66298e75ed87571486f4364",
      "details": {
        "parent_model": "",
        "format": "gguf",
        "family": "qwen2",
        "families": [
          "qwen2"
        ],
        "parameter_size": "7.6B",
        "quantization_level": "Q4_K_M"
      }
    },
    {
      "name": "qwen2.5-coder:32b",
      "model": "qwen2.5-coder:32b",
      "modified_at": "2026-04-22T15:37:04.294619352Z",
      "size": 19851349898,
      "digest": "b92d6a0bd47ee79114298de0177bf920c05a706d12633950b3936778492bef41",
      "details": {
        "parent_model": "",
        "format": "gguf",
        "family": "qwen2",
        "families": [
          "qwen2"
        ],
        "parameter_size": "32.8B",
        "quantization_level": "Q4_K_M"
      }
    }
  ]
}
```

Great! The model serving works as expected. Now, let's install and confire the [VS Code Continue plugin](https://marketplace.visualstudio.com/items?itemName=Continue.continue) to use Ollama.

Installation is straight forward; just like any other VS code plugin. I added the following config to `~/.continue/config.yaml`:

```yaml
name: Local Config
version: 1.0.0
schema: v1
models:
  - name: Qwen
    provider: ollama
    model: qwen2.5-coder:7b
    apiBase: http://localhost:11434
    roles:
      - chat
      - edit
      - apply
  - name: Qwen
    provider: ollama
    model: qwen2.5-coder:7b
    apiBase: http://localhost:11434
    roles:
      - autocomplete
```

This sets `qwen2.5-coder:7b` as the model for multiple roles including `chat` and `autocomplete`. Continue works similarly to the Copilot plugin, requiring no effort in adapting to it. That's it. Now, I can use my local coding assistant with peace of mind. I am satisfied with the quality of coding assistance, and for my usage, I didn't feel any sluggishness in my setup.
