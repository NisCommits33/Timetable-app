export default function WeekView({tasks}){
    console.log("taks received in WeekView",tasks);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return(
        <div className="week-view">
            <h2>this is the week view</h2>
            <p>I have {tasks.length} tasks
            </p>
            {/* debuggin */}
            {/* <h3>{days}</h3> */}
            <div className="days-container">
                {days.map(daysName => {
                    const tasksForToday = tasks.filter(task => task.day ===daysName)

                    return(
                        <div key = {daysName}>
                            <h3>
                                {daysName} ({tasksForToday.length})
                            </h3>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}