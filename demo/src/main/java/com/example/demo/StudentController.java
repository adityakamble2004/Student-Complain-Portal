package com.example.demo;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private StudentRepository repository;

    public StudentController(StudentRepository repository) {
        this.repository = repository;
    }

    // GET all students
    @GetMapping
    public List<Student> getAllStudents() {

        return repository.findAll();
    }

    // GET student by ID
    @GetMapping("/{id}")
    public Student getStudent(@PathVariable int id) {

        return repository.findById(id).orElse(null);
    }

    // POST student
    @PostMapping
    public Student addStudent(@RequestBody Student student) {

        return repository.save(student);
    }

    // DELETE student
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable int id) {

        repository.deleteById(id);

        return "Student deleted successfully";
    }
}