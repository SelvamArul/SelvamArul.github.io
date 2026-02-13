---
layout: page
title: Amazon Robotics Challenge
description: Team NimbRo Picking @ Amazon Robotics Challenge
img: assets/img/ARC.png
importance: 1
category: robotics
related_publications: true
---

Participating in the Amazon Robotics Challenge (ARC) was pivotal in understanding the complexities of large-scale bin-picking perception systems. During the inaugural 2016 edition, I developed my first deep-learning-based perception system and was impressed by the efficiency of transfer learning. Despite our small team size, we built a robust object detection module using only a few manually annotated images. The 2017 challenge significantly increased in difficulty; unlike the previous year, teams were given new objects just 45 minutes before the start, requiring highly adaptable perception pipelines. Our team performed exceptionally well, earning second place, and the lessons learned fundamentally shaped my Ph.D. research. The following article describe our ARC robotic systems:
{% cite schwarz2017nimbro %},
{% cite schwarz2018rgb %},
{% cite schwarz2018fast %}, and
{% cite periyasamy2018robust %}

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/publication_preview/ijrr.png" title="UAV" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    ARC 2016 robotic setup.
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/publication_preview/arc.png" title="UAV" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Semantic segmetation model developed for ARC 2016. a) RGB input. b) Semantic segmentation result. c) Object contours generated.
</div>
