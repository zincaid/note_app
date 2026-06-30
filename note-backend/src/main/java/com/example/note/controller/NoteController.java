package com.example.note.controller;

import com.example.note.model.NoteEntity;
import com.example.note.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:5173")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @GetMapping
    public List<NoteEntity> getAllNotes() {
        return noteRepository.findAll();
    }

    @PostMapping
    public NoteEntity createNote(@RequestBody NoteEntity note) {
        return noteRepository.save(note);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id) {
        noteRepository.deleteById(id);
    }
    
    @PutMapping("/{id}")
    public NoteEntity updateNote(@PathVariable Long id, @RequestBody NoteEntity updatedNote) {
        return noteRepository.findById(id).map(note -> {
            note.setTitle(updatedNote.getTitle());
            note.setContent(updatedNote.getContent());
            return noteRepository.save(note);
        }).orElseThrow(() -> new RuntimeException("Note not found"));
    }
}