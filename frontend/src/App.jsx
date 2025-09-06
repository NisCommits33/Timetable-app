import { useState } from 'react'
import './App.css'
import WeekView from './components/WeekView'
import AddTaskForm from './components/AddTaskForm'

// defining initial data
const initialTasks  = [
  {
  id:1,
  title: "Morning Freshness",
  startTime:"7:00",
  endTime:"7:30",
  date: "2025/08/28",
  day:"Monday"
  },
  {
  id:2,
  title: "Morning walk",
  startTime:"7:30",
  endTime:"8:00",
  date: "2025/08/28",
  day:"Monday"
  },
  {
  id:3,
  title: "Read",
  startTime:"8:00",
  endTime:"9:00",
  date: "2025/08/28",
  day:"Tuesday"
  },
  {
  id:4,
  title: "Read",
  startTime:"8:00",
  endTime:"9:00",
  date: "2025/08/28",
  day:"Wednesday"
  },
  {
  id:3,
  title: "Read",
  startTime:"8:00",
  endTime:"9:00",
  date: "2025/08/28",
  day:"Tuesday"
  }

]

function App() {
  // initolazing state with tasks
  const [tasks, setTasks] = useState(initialTasks)
  const [selectedDay, setselectedDay] = useState(null) //state for day selected

   // callback function to handle the click event
    const handleDayClick = (clickedDay) =>{
        console.log("you clicked on:," ,clickedDay)
        setselectedDay(clickedDay) 
    };

  const addTask = (newTask) => {

    setTasks(prevTasks => [...prevTasks, newTask]);

  }
  //delete task
  const deleteTask = (taskIdToDelete) =>{
    console.log("deleteTask function called with ID:" ,taskIdToDelete);
  
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskIdToDelete));

  }

  return (
    <>
      <div className="app">
        <h1>My Timetable</h1>
        <AddTaskForm onAddTask={addTask} />
        <WeekView 
        tasks={tasks}
         onDayClick = {handleDayClick} 
         selectedDay={selectedDay}
         onDeleteTask={deleteTask}
         />
      </div>
    </>
  )
}

export default App
