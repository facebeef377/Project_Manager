package com.gitara.ProjectManager.Repositories;


import com.gitara.ProjectManager.Entities.Task_category;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Task_categoryRepository extends CrudRepository<Task_category, Long> {

}
