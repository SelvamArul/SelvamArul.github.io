---
title: 'C++ features'
date: 2020-12-19
permalink: /posts/cpp
tags:
  - cpp
---

### User-defined literals
In my first ever blog post, I would like to share one of favourite c++ features, user-defined literals. We are well used to built-in literals. e.g. 
```
59u     //unsigned int
065l    //long
8.276f  //float
3E1l    //long double
```
A compelling use case for user-defined literals is demostrated in this code snippet.
<iframe height="400px" width="100%" src="https://repl.it/@ArulSelvam1/userdefinedliterals?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

For more on user-defined literals, please read this [post](https://docs.microsoft.com/en-us/cpp/cpp/user-defined-literals-cpp?view=msvc-160).