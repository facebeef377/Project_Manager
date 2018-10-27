package com.gitara.ProjectManager.Controllers;

import com.gitara.ProjectManager.Emailer.Emailer;
import com.gitara.ProjectManager.Entities.PM_User;
import com.gitara.ProjectManager.Repositories.PM_UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/admin")
public class AdminController {

    @Autowired
    Emailer emailer;
    @Autowired
    PM_UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    //Dodanie użytkownika
    @PostMapping(path = "/addUser", produces = MediaType.APPLICATION_JSON_VALUE, consumes = "application/json")
    public @ResponseBody
    Map<String, String> addUser(@RequestBody PM_User user) {
        Map<String, String> result = new HashMap<String, String>();
        boolean loginTaken = !(userRepository.getUserByUsername(user.getUsername()) == null);
        boolean emailTaken = !(userRepository.getUserByEmail(user.getEmail()) == null);
        if (!loginTaken && !emailTaken) {
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            emailer.sendEmailWelcome(user);
            result.put("Status", "OK");
            return result;
        } else {
            if (emailTaken)
                result.put("Status", "FAILED_EMAIL");
            else if (loginTaken)
                result.put("Status", "FAILED_LOGIN");
            return result;
        }
    }

    @PostMapping(value = "/editUser")
    public Map<String, String> editUser(@RequestBody PM_User user) {
        if (user.getPassword().equals(null) && user.getPassword().equals(""))
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        else
            user.setPassword(userRepository.getUserByUsername(user.getUsername()).getPassword());
        userRepository.save(user);
        Map<String, String> result = new HashMap<String, String>();
        result.put("Status", "OK");
        return result;
    }


}
