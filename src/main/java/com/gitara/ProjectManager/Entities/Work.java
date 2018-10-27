package com.gitara.ProjectManager.Entities;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
public class Work {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    @ManyToOne
    @JoinColumn(name = "worker_id", nullable = false)
    private PM_User worker;
    private Timestamp start_time;
    private Timestamp end_time;
    private String comment;
    @ManyToOne
    private Task task;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public PM_User getWorker() {
        return worker;
    }

    public void setWorker(PM_User worker) {
        this.worker = worker;
    }

    public Timestamp getStart_time() {
        return start_time;
    }

    public void setStart_time(Timestamp start_time) {
        this.start_time = start_time;
    }

    public Timestamp getEnd_time() {
        return end_time;
    }

    public void setEnd_time(Timestamp end_time) {
        this.end_time = end_time;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }
}
