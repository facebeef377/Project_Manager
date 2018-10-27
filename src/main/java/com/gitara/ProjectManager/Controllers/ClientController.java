package com.gitara.ProjectManager.Controllers;

import com.gitara.ProjectManager.Entities.Client;
import com.gitara.ProjectManager.Repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/clients")
public class ClientController {

    @Autowired
    ClientRepository clientRepository;

    @GetMapping(value = "/all")
    public List<Client> getTestData() {
        return (List<Client>) clientRepository.findAll();
    }

    @PostMapping(value = "/add")
    public Map<String, String> addClient(@RequestBody Client client) {
        Map<String, String> result = new HashMap<String, String>();

        if (!clientRepository.existsByName(client.getName())) {
            clientRepository.save(client);
            result.put("Status", "OK");
        } else
            result.put("Status", "FAILED");

        return result;
    }

    @PostMapping(value = "/edit")
    public Map<String, String> editClient(@RequestBody Client client) {
        Map<String, String> result = new HashMap<String, String>();
        clientRepository.save(client);
        result.put("Status", "OK");
        return result;
    }

    @PostMapping(value = "/delete")
    public Map<String, String> deleteClient(@RequestBody Client client) {
        Map<String, String> result = new HashMap<String, String>();
        clientRepository.deleteById((long) client.getId());
        result.put("Status", "OK");
        return result;
    }


}