package com.gitara.ProjectManager.Repositories;

import com.gitara.ProjectManager.Entities.Work;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkRepository extends CrudRepository<Work, Long> {

    Work findByTaskId(int id);
}
