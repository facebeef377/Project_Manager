package com.gitara.ProjectManager.Repositories;

import com.gitara.ProjectManager.Entities.Project;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends CrudRepository<Project, Long> {

    boolean existsByName(String name);
}
