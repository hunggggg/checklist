import { 
  GET_DATA,
  CLEAR_DATA,
  SET_CONNECTION,
  CREATE_TASK,
  EDIT_TASK,
  TOGGLE_PINNED,
  TOGGLE_DONE,
  REMOVE_TASK,
  SET_AVATAR,
  SET_NAME,
  SET_PHONE,
} from '../actions/UserDataActions';

import { storeLocalUserData, updateUserData } from '../../api';


const initialState = {
  connection: false,
  loggedIn: false,
  data: {
    uid: "Guest",
    tasks: [],
  },
};

export default function userDataReducers(state = initialState, action) {
  const payload = action.payload;
  var currentTaskList = state.data.tasks;
  var newTaskList = [];
  var newData = {};
  
  switch(action.type) {
    case GET_DATA:
      return {
        ...state,
        loggedIn: payload.data.uid !== "Guest",
        data: { ...payload.data },
      };
    case CLEAR_DATA:
      return {
        ...initialState,
        connection: state.connection,
      };
    case SET_CONNECTION:
      return {
        ...state,
        connection: payload.status,
      };
    case CREATE_TASK:
      newTaskList = [
        { id: (currentTaskList.length == 0) ? 0 : currentTaskList[0].id + 1, ...payload.task },
        ...currentTaskList,
      ];
      newData = { ...state.data, tasks: newTaskList };
      updateUserData(state.data.uid, JSON.stringify(newTaskList), 'tasks');
      storeLocalUserData(JSON.stringify(newData));
      return { ...state, data: newData };
    case EDIT_TASK:
      newTaskList = currentTaskList.map(task => 
        (task.id === payload.selected.id) ? 
        { id: payload.selected.id, ...payload.task } : task
      );
      newData = { ...state.data, tasks: newTaskList };
      updateUserData(state.data.uid, JSON.stringify(newTaskList), 'tasks');
      storeLocalUserData(JSON.stringify(newData));
      return { ...state, data: newData };
    case REMOVE_TASK:
      newTaskList = currentTaskList.filter(task => task.id !== payload.selected.id);
      newData = { ...state.data, tasks: newTaskList };
      updateUserData(state.data.uid, JSON.stringify(newTaskList), 'tasks');
        storeLocalUserData(JSON.stringify(newData));
      return { ...state, data: newData };
    case TOGGLE_PINNED:
      newTaskList = currentTaskList.map(task => 
        (task.id === payload.selected.id) ? 
        { ...task, pinned: !task.pinned } : task
      );
      newData = { ...state.data, tasks: newTaskList };
      updateUserData(state.data.uid, JSON.stringify(newTaskList), 'tasks');
      storeLocalUserData(JSON.stringify(newData));
      return { ...state, data: newData };
    case TOGGLE_DONE:
      newTaskList = currentTaskList.map(task => 
        (task.id === payload.selected.id) ? 
        { ...task, done: !task.done } : task
      );
      newData = { ...state.data, tasks: newTaskList };
      updateUserData(state.data.uid, JSON.stringify(newTaskList), 'tasks');
      storeLocalUserData(JSON.stringify(newData));
      return { ...state, data: newData };
    case SET_AVATAR:
      newData = { ...state.data, avatar: payload.color };
      updateUserData(state.data.uid, payload.color, 'avatarColor');
      storeLocalUserData(JSON.stringify(newData));
      return { ...state, data: newData };
    case SET_NAME:
      newData = { ...state.data, name: payload.name };
      updateUserData(state.data.uid, payload.name, 'fullName');
      storeLocalUserData(JSON.stringify(newData));
      return { ...state, data: newData };
    case SET_PHONE:
      newData = { ...state.data, phone: payload.phone };
      updateUserData(state.data.uid, payload.phone, 'phoneNumber');
      storeLocalUserData(JSON.stringify(newData));
      return { ...state, data: newData };
    default:
      return state;
  }
};
