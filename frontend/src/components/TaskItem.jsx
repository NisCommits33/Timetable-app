function TaskItem({task, onDelete}){
    const handleDeleteClick = () => {
        alert("deleted")
        console.log("taskitem received prop:", {onDelete});
        
        onDelete(task.id);
    };
    return(
        <div className="task-item">
            <strong>{task.title}</strong>
            <p>{task.startTime} - {task.endTime} </p>
            <button onClick={handleDeleteClick} className = 'delete-btn'>
                Delete
            </button>
        </div>
    )
}
export default TaskItem;