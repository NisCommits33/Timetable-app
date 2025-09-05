function TaskItem({task}){
    return(
        <div className="task-item">
            <strong>{task.title}</strong>
            <p>{task.startTime} - {task.endTime} </p>
        </div>
    )
}
export default TaskItem;