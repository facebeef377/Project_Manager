package com.gitara.ProjectManager.Controllers;


import com.gitara.ProjectManager.Entities.Project;
import com.gitara.ProjectManager.Repositories.ProjectRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/projects")
public class ProjectController {
    ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // @Autowired
    private ProjectRepository projectRepository;

    @GetMapping(value = "/all")
    public List<Project> getProjects() {
        return (List<Project>) projectRepository.findAll();
    }

    @PostMapping(value = "/add")
    public Map<String, String> addProject(@RequestBody Project project) {
        Map<String, String> result = new HashMap<>();
        if (!projectRepository.existsByName(project.getName())) {
            projectRepository.save(project);
            result.put("Status", "OK");
        } else
            result.put("Status", "FAILED");

        return result;
    }

    @PostMapping(value = "/edit")
    public Map<String, String> editClient(@RequestBody Project project) {
        Map<String, String> result = new HashMap<>();
        projectRepository.save(project);
        result.put("Status", "OK");
        return result;
    }

    @PostMapping(value = "/delete")
    public Map<String, String> deleteClient(@RequestBody Project project) {
        Map<String, String> result = new HashMap<>();
        projectRepository.deleteById((long) project.getId());
        result.put("Status", "OK");
        return result;
    }


}