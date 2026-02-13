---
layout: page
title: Confidential Edge Computing
description: Enabling confidential computing for open edge platforms
img: assets/img/CoCo.jpg
importance: 1
category: edge&cloud
---

In industrial settings, AI model providers, digital asset providers, and platform providers are often distinct entities. While general-purpose AI providers like OpenAI and Anthropic primarily offer models via web services—where consumers access only APIs rather than the actual model files—industrial requirements differ significantly.
Due to latency requirements and privacy concerns, industrial models must often be deployed directly on a platform provider's hardware within a customer's shop floor. In these environments, protecting AI models from reverse engineering is a critical requirement. Standard mechanisms such as data-at-rest encryption (for disk storage) and data-in-transit encryption (for network transfers) ensure models reach the end customer securely.
However, once a model is loaded into RAM, it becomes "data-in-use". Privileged or co-located attackers who gain access to the system can read this data to reverse-engineer models and digital assets. [Trusted Execution Environments](https://www.intel.de/content/www/de/de/products/docs/accelerator-engines/trust-domain-extensions.html) (TEEs) address this by providing secure, isolated areas within a processor that guarantee the confidentiality and integrity of loaded code and data.
In recent years, confidential computing—built on TEEs and remote attestation—has gained significant traction. [Major cloud service providers](https://confidentialcomputing.io/about/members/) (CSPs) now offer various solutions to integrate confidential workloads into managed Kubernetes clusters. One of my research activities at Siemens AG focuses on enabling these confidential computing capabilities on open edge platforms.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="https://blogs.nvidia.com/wp-content/uploads/2023/03/Confidential-computing-three-leg-stool-NV-672x309.jpg" title="Confidential Computing" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Confidential computing enables data-in-use protection. Source: https://blogs.nvidia.com/blog/what-is-confidential-computing/
</div>
