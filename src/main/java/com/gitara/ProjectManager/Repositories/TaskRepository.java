package com.gitara.ProjectManager.Repositories;

import com.gitara.ProjectManager.Entities.Task;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends CrudRepository<Task, Long> {

}
