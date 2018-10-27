package com.gitara.ProjectManager.Repositories;

import com.gitara.ProjectManager.Entities.PM_User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PM_UserRepository extends CrudRepository<PM_User, Long> {


    PM_User getUserByUsername(String username);

    PM_User getUserByEmail(String email);
}
