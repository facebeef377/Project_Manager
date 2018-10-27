package com.gitara.ProjectManager.Entities;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
public class Task {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Project project;
    @ManyToOne
    private Task_category category;
    private String name;
    private String description;
    private Timestamp deadline;
    private int predicted_worktime;
    private double rate;
    @ManyToOne
    @JoinColumn(name = "worker_id", nullable = false)
    private PM_User worker;
    private int progress;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Task_category getCategory() {
        return category;
    }

    public void setCategory(Task_category category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getDeadline() {
        return deadline;
    }

    public void setDeadline(Timestamp deadline) {
        this.deadline = deadline;
    }

    public int getPredicted_worktime() {
        return predicted_worktime;
    }

    public void setPredicted_worktime(int predicted_worktime) {
        this.predicted_worktime = predicted_worktime;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    public PM_User getWorker() {
        return worker;
    }

    public void setWorker(PM_User worker) {
        this.worker = worker;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }
}
