## 2022-08: RT-1

Data: 130k demonstrations, 700+ tasks <br>
Action tokens: Continuous dimensions are discretized into 256 bins uniformly <br>
Action head: No seperate action head

## 2023-07: RT-2

Data: Co-Fine-Tuning of robot + web data <br>
Action Tokens: Same as RT-1 <br>
No seperate action head <br>

## 2023-10: Open X-Embodiment dataset & RT-X

Data: 22 robot embodiments, 527 skills, 160266 tasks, 1000+ of teleoperational data <br>
Action Tokens: RT-1-X & RT-2-X are RT-1 & RT-2 trained Open X-Embodiment <br>
Action head: Action expert based on flow matching

## 2024-10: π_0 model

Data: Open X-Embodiment + web data <br>
Action Tokens: Action expert based on flow matching <br>

## 2025-02: FAST Tokens

Action Tokens: FAST <br>
Action head: Autoregression (make action tokenization & generation similar to LLMs/VLMs) <br>

## 2024-10: π_5 model

Action Tokens: intermediate FAST & continuous action commands
Action head: intermediate autoregressive FAST & flow matching-based continuous action
