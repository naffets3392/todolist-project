import { useEffect, useState } from 'react';
import './App.css';
import { Box, TextField, MenuItem, createTheme } from '@mui/material';
import {FaRegEdit} from 'react-icons/fa'
import {AiOutlineDelete} from 'react-icons/ai'
import {SlPin} from 'react-icons/sl'

function checkLS() {
  return localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []
}

function App() {
  const [todo,setTodo] = useState('')
  const [todoList,setTodoList] = useState(checkLS())
  const [alert,setAlert] = useState({text: '', color: '', showAlert: false})
  const [todoSelect,setTodoSelect] = useState('All')
  const [filteredTodos,setFilteredTodos] = useState([])

  function changeAlert(text,color) {
    setAlert({text,color,showAlert: true})
  }

  function handleSubmit(e) {
    e.preventDefault()

    if(!todo) {
      changeAlert('You need todo! Try again', 'redAlert')
      return
    } else if (todoList.find(todoObj => todoObj.todo === todo)) {
      changeAlert('Already have this Todo!', 'redAlert')
      return
    }  else {
      changeAlert('Todo is added!', 'greenAlert')
      const todoObj = {todo: todo, isEditing: false, isFinished: false}
      setTodoList([...todoList, todoObj])
      setTodo('')
    }
  }

  function finishedTodo(id) {
    changeAlert('Todo is finished!', 'greenAlert')
    setTodoList(oldTodos => {
      return oldTodos.map(todo => {
        return todo.todo === id ? {...todo,isFinished: !todo.isFinished} : todo
      })
    })
  }

  function deletedTodo(id) {
    changeAlert('Todo is deleted!', 'redAlert')
    setTodoList(oldTodos => {
      return oldTodos.filter(todo => todo.todo !== id)
    })
  }

  function editingTodo(id) {
    changeAlert('Editing todo!', 'orangeAlert')
    setTodoList(oldTodos => {
      return oldTodos.map(todo => {
        return todo.todo === id ? {...todo,isEditing: !todo.isEditing} : todo
      })
    })
  }

  function editingTodoText(targetValue,id) {
    setTodoList(oldTodos => {
      return oldTodos.map(todo => {
        return todo.todo === id ? {...todo,todo: targetValue} : todo
      })
    })
  }

  function clearTodos() {
    changeAlert('Todo list is clear!', 'redAlert')
    setTodoList([])
  }

  useEffect(() => {
    const newTodos = todoList.filter(todo => {
      if(todoSelect === `All`) {
        return todo
      } else if(todoSelect === `Finished`) {
        if(todo.isFinished) {
          return todo
        } 
      } else if(todoSelect === `Not finished`){
        if(!todo.isFinished) {
          return todo
        }
      }
    })
    setFilteredTodos(newTodos) 
  },[todoList,todoSelect])

  localStorage.setItem('todos', JSON.stringify(todoList))

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlert({text: '', color: '', showAlert: false})
    },1500)
    return () => {
      clearTimeout(timeout)
    }
  },[alert])

  return (
    <div className="App">
      {alert.showAlert && <p className={`alert ${alert.color}`}>{alert.text}</p>}
      <h1>TODO LIST</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder='Add todo...' value={todo} type="text" onChange={(e) => setTodo(e.target.value)}/>
        <button type='submit'>Add ToDo</button>
      </form>
      {todoList.length ? <div className='todoList__container'>
      <Box className='select__container' width={`200px`}>
          <TextField InputLabelProps={{className: 'labelColor'}} className='textfield' fullWidth label='Select todos' select value={todoSelect} onChange={(e) => setTodoSelect(e.target.value)}>
            <MenuItem className='item' value='All'>All</MenuItem>
            <MenuItem className='item' value='Finished'>Finished</MenuItem>
            <MenuItem className='item' value='Not finished'>Not finished</MenuItem>
          </TextField>
        </Box>
        <div className='todoList__Container__todos'>
        {filteredTodos.map(todo => {
          const isEditing = todo.isEditing ? '' : 'readOnly'
          console.log(isEditing)
          return (
            <div className={`todoItem ${todo.isFinished ? 'finishedTodo' : ''}`}>
              <input className={todo.isEditing ? 'editingText' : ''} value={todo.todo} onChange={(e) => editingTodoText(e.target.value,todo.todo)} readOnly={isEditing}/>
              <div className='icons'>
                <FaRegEdit onClick={() => editingTodo(todo.todo)} className='icon editIcon'/>
                <AiOutlineDelete onClick={() => deletedTodo(todo.todo)} className='icon deleteIcon'/>
                <SlPin onClick={() => finishedTodo(todo.todo)} className='icon finishedIcon'/>
              </div>
            </div>
          )
        })}
        <button onClick={clearTodos} className='clearButton'>Clear Todos</button>
        </div>
      </div> : <h1 className='todoAlertText'>You dont have Todos! Add one?</h1>}
    </div>
  );
}

export default App;
