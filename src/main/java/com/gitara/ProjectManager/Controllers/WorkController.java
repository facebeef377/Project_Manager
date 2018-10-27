package com.gitara.ProjectManager.Controllers;

import com.gitara.ProjectManager.Entities.Task;
import com.gitara.ProjectManager.Entities.Work;
import com.gitara.ProjectManager.Repositories.WorkRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/work")
public class WorkController {
    WorkController(WorkRepository workRepository) {
        this.workRepository = workRepository;
    }

    // @Autowired
    private WorkRepository workRepository;

    @GetMapping(value = "/all")
    public List<Work> getWorks() {
        return (List<Work>) workRepository.findAll();
    }

    @PostMapping(value = "/add")
    public Map<String, String> addProject(@RequestBody Work work) {
        Map<String, String> result = new HashMap<>();
        workRepository.save(work);
        result.put("Status", "OK");
        return result;
    }

    @PostMapping(value = "/edit")
    public Map<String, String> editClient(@RequestBody Work work) {
        Map<String, String> result = new HashMap<>();
        workRepository.save(work);
        result.put("Status", "OK");
        return result;
    }

    @PostMapping(value = "/delete")
    public Map<String, String> deleteClient(@RequestBody Work work) {
        Map<String, String> result = new HashMap<>();
        workRepository.deleteById((long) work.getId());
        result.put("Status", "OK");
        return result;
    }

    @PostMapping(value = "/byTask")
    public Map<String, String> getByTask(@RequestBody Task task) {
        Map<String, String> result = new HashMap<>();
        Work work = workRepository.findByTaskId(task.getId());
        result.put("Status", "OK");
        return result;
    }
}
