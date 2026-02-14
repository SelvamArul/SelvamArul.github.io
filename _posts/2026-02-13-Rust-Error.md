---
layout: post
title: Rust vs. Go error handling
date: 2026-02-13 15:09:00
description: Rust vs. Go error handling
tags: rust go
categories: programming-laguages
featured: true
---

Lately, I've been programming a lot in Go and Rust. During my Ph.D. years, most of my research code—particularly machine learning (ML) code—was written in Python, and C++ was the primary language I used for programming with ROS. C was the first programming language I learned back in high school, and C++ followed soon after. I would even say my algorithmic thinking is shaped by C++ more than any other language. However, Go and Rust feel modern—although many experienced programmers would say the concepts are nothing new and have existed in other languages for decades. That's a discussion for another day.

Now, back to Go and Rust. I like the simplicity of Go. Features like built-in concurrency and garbage collection make programming in Go a pleasure. I feel as productive as I used to when writing vectorized NumPy code in Python. However, I can't help but admire how much Rust keeps me from writing bad code. This philosophy is built into the core of the language and shows in every aspect of the language design. This week I noticed a subtle difference between error handling in Go and Rust that illustrates this.

Let's consider a simple function that reads file content. The following function uses idiomatic Go [multiple return values](https://gobyexample.com/multiple-return-values) to return both a value and an error. In fact, the `os.Open` library function on line 8 also returns two values: a file handler and an error. Anyone even slightly familiar with Go should have seen the error handling pattern if `err != nil` used on line 13 many times. It's idiomatic to handle errors immediately after a function call."

{% highlight go linenos %}
package main

import (
    "os"
    "io"
)
func readFileContent() (string, error) {
    file, err := os.Open("data.txt") // Returns both file AND error
    // DANGER: file might be nil, but it's still accessible!   
    if err != nil {
        return "", err
    }
    content, err := io.ReadAll(file)
    if err != nil {
        return "", err
    }
    return string(content), nil
}
{% endhighlight %}

Let's compare this with error handling in Rust using [Result](https://doc.rust-lang.org/std/result/) type. 

{% highlight rust linenos %}
use std::fs::File;
use std::io::Read;
fn read_file_content() -> Result<String, std::io::Error> {
    // File::open returns Result<File, Error>
    let mut file = File::open("data.txt")?; // Either succeeds OR returns early
    let mut content = String::new();
    file.read_to_string(&mut content)?; // file is GUARANTEED to be valid here
    Ok(content)
}
{% endhighlight %}

In this example,  can return a value of `String` type if the functions succeeds wihtout any errors or value of  tpye if an error occurs.  Note that the library function also returns . The interesting aspect of Rust error handling is, in case of an error in `File::open` , the function  immediately returns with  and the rest if of the lines are not executed. Compare this with Go's  pattern that is not enfored by the compiler. 


In this example, `read_file_content` can return a value of `String` type if the function succeeds without any errors, or a value of `std::io::Error` type if an error occurs. Note that the library function `File::open`  also returns `Result<File, Error>`. The interesting aspect of Rust error handling is that in case of an error in `File::open` , the function `read_file_content` immediately returns with `std::io::Error` and the rest of the lines are not executed. This is different from Go's `err != nil` pattern, which is not enforced by the compiler.


```go
// This Go code compiles but crashes at runtime!
func brokenExample() {
    file, err := os.Open("nonexistent.txt") // file is nil, err is not nil
    // Programmer forgets to check err...
    content, _ := io.ReadAll(file) // PANIC! Dereferencing nil pointer
    println(string(content))
}
```

```rust
// This Rust is IMPOSSIBLE to compile:
fn broken_example() {
    let file = File::open("data.txt"); // This is Result<File, Error>
    // file.read_to_string(&mut String::new()); // COMPILER ERROR!
    // Cannot call methods on Result - must handle the error first!
}
```