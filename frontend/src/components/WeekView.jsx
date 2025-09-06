import '../App.css'
import TaskItem from "./TaskItem"

export default function WeekView({tasks, onDayClick,selectedDay, onDeleteTask}){
    console.log("taks received in WeekView",tasks);
console.log("weekview received props:", {onDeleteTask});

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

   
    
    return(
        <div className="week-view">
            <h2>this is the week view</h2>
            <p>I have {tasks.length} tasks
            </p>

            {/* debuggin */}
            {/* <h3>{days}</h3> */}
            {/* callback function */}
            <div className="days-container">
                {days.map(daysName => {
                    const tasksForToday = tasks.filter(task => task.day ===daysName)
                    console.log("about to render TaskItem  with onDeleteTask:",onDeleteTask);
                    
                    return(
                        <div className={daysName ===selectedDay ? 'selected' : ''} /*targeting css with if statement "selected is classname"*/ key = {daysName}>
                            <h3 className="days"onClick={() => onDayClick(daysName)} >
                                {daysName}({tasksForToday.length })
                            </h3>
                           <div className="task-list">
                            {tasksForToday.map(task => (
                                <TaskItem key={task.id} task={task} onDelete = {onDeleteTask} />
                            ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}