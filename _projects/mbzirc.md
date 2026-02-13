---
layout: page
title: Mobile Robotics & UAVs
description: Team NimbRo @ MBZIRC
img: assets/img/mbzirc.jpg
importance: 2
category: robotics
related_publications: true
---

I participated in two MBZIRC editions with Team NimbRo, completing various challenges that integrated UAVs, UGVs, and cross-platform collaboration.

**MBZIRC 2017**
In the 2017 edition, the UAV's task was to land on a moving truck and autonomously collect moving objects from the ground. Meanwhile, the UGV had to locate a black box within the arena, approach it, and identify the side featuring hanging wrenches. From several available options, the UGV needed to select the correctly sized wrench to identify a valve, estimate its pose, and rotate it.

I developed a deep learning-based approach to locate specific wrenches and implemented a module for valve pose estimation using a short-range [pmd CamBoard pico flexx](https://3d.pmdtec.com/en/3d-cameras/flexx2/) depth camera; these contributions are detailed in the following article:" {% cite schwarz2019team %}

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="https://www.ais.uni-bonn.de/nimbro/MBZIRC/images/MBZIRC_NimbRo_Grand_Challenge_MAV_Landing_2017_03_18.jpg" title="UAV" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="https://www.ais.uni-bonn.de/nimbro/MBZIRC/images/MBZIRC_NimbRo_Grand_Challenge_Valve_Turning_2017_03_18.jpg" title="UGV" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="https://www.ais.uni-bonn.de/nimbro/MBZIRC/images/MBZIRC_NimbRo_Challenge_2_Run_2_5_2017_03_17.jpg" title="UGV action" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

**MBZIRC 2020**
The 2020 edition focused on autonomous firefighting, where I contributed to both UAV and UGV development. I designed an object detection module for the UAV, optimizing it for energy-efficient execution on an on-board [Google Edge TPU](https://developers.google.com/coral). For the UGV, I implemented object detection and 3D model registration using laser point clouds. These contributions are detailed in the following papers: {% cite lenz2020autonomous %} and {% cite lenz2021team %}

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/mbzirc-202-uav.png" title="UAV" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    UAV with on-board Edge TPU.
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/mbzirc-202-icp.png" title="UGV" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Object detection and registration using laser point clouds.
</div>
