package com.gitara.ProjectManager.Repositories;

import com.gitara.ProjectManager.Entities.Client;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends CrudRepository<Client, Long> {

    boolean existsByName(String name);
}



