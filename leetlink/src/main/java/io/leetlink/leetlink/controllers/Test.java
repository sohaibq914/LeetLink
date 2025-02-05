package io.leetlink.leetlink.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;




@RestController
@RequestMapping("/api")
public class Test {
    @GetMapping("/hello")
    public String hello() {
        return "Hello from LeetLink!";
    }
}
