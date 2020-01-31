import {AppActions, StateActionTypes} from './app.actions';
import {AppState, EventStorage} from './app.state';
import * as moment from 'moment';
import {Event, GroupedEvents} from '../models/event';

const initialState: AppState = {
  monthlyViewMode: true,
  activeDate: moment().utc(true),
  activeDateEvents: null,
  events: Object.create({})
};

interface DateEntries {
  year: number;
  month: number;
  dateStr: string;
}

interface EventsStateSlice {
  events: EventStorage;
  activeDateEvents: {
    [date: string]: GroupedEvents
  };
}

export function reducer(state = initialState, action: AppActions): AppState {
  switch (action.type) {
    case StateActionTypes.ToggleViewMode:
      return {
        ...state,
        monthlyViewMode: action.payload
      };
    case StateActionTypes.ChangeActiveDate:
      return {
        ...state,
        activeDate: action.payload.clone().utc(true),
        activeDateEvents: getEventsForDate(state, action.payload.utc(true))
      };
    case StateActionTypes.ChangeActiveMonth:
      return {
        ...state,
        activeDate: state.activeDate.clone().add(action.payload, 'month')
      };
    case StateActionTypes.MonthlyEventsFetched:
      return {
        ...state,
        events: addMonthEventsToState(state, action.payload)
      };

    case StateActionTypes.CreateEventSuccess:
      return {
        ...state,
        events: addEventToState(state.events, action.payload)
      };

    case StateActionTypes.DeleteEventSuccess: {
      const {events, activeDateEvents} = deleteEventFromState(state.events, action.payload, state.activeDate);
      const dateEvents = activeDateEvents ? activeDateEvents : state.activeDateEvents;
      return {
        ...state,
        events,
        activeDateEvents: dateEvents
      };
    }

    case StateActionTypes.UpdateEventSuccess: {
      const { events, activeDateEvents } = updateEvent(state, action.payload);
      const dateEvents = activeDateEvents ? activeDateEvents : state.activeDateEvents;
      return {
        ...state,
        events,
        activeDateEvents: dateEvents
      };
    }
    case StateActionTypes.LoadEventsForMonth:
    case StateActionTypes.CreateEvent:
    case StateActionTypes.UpdateEvent:
    case StateActionTypes.DeleteEvent:
    default:
      return state;
  }
}

function getEventsForDate(state: AppState, activeDate: moment.Moment): {[date: string]: GroupedEvents} {
  const {year, month, dateStr: date} = getDateEntries(activeDate);
  const isPresentEventsForActiveDate = date in state.events[year][month];

  if (year in state.events) {
    if (isPresentEventsForActiveDate) {
      return {[date]: state.events[year][month][date]};
    }
  }
  return {};
}

function addEventToState(eventsState: EventStorage, event: Event): EventStorage {
  const {year, month, dateStr: date} = getDateEntries(moment(event.startDate));
  const events = Object.assign(eventsState);

  if (events.hasOwnProperty(year)) {
    if (events[year].hasOwnProperty(month)) {
      if (events[year][month].hasOwnProperty(date)) {
        events[year][month][date].events.push(event);
        events[year][month][date].categories.add(event.category.color);
      } else {
        events[year][month][date] = {events: [event], categories: new Set([event.category.color])};
      }
    }
  }
  return events;
}

function addMonthEventsToState(state: AppState, events: GroupedEvents): EventStorage {
  const {year, month} = getDateEntries(state.activeDate);
  const eventsState = Object.assign(state.events);
  if (!(year in state.events)) {
    eventsState[year] = { [month]: events };
  } else {
    eventsState[year] = {
      ...eventsState[year],
      [month]: events,
    };
  }
  return eventsState;
}


function deleteEventFromState(state: EventStorage, event: Event, activeDate: moment.Moment): EventsStateSlice {
  const {year, month, dateStr: date} = getDateEntries(moment(event.startDate));
  const dateEvents = Object.assign(state[year][month][date]);

  dateEvents.events = dateEvents.events.filter( dayEvent => event._id !== dayEvent._id);
  const events = {
    ...state,
    [year]: {
      ...state[year],
      [month]: {
        ...state[year][month],
        [date]: dateEvents
      }
    }
  };
  let activeDateEvents = activeDate.isSame(moment(event.startDate), 'date') ? {[date]: dateEvents} : null;
  if (dateEvents.events.length === 0) {
    delete events[year][month][date];
    activeDateEvents = {};
  }
  return { events, activeDateEvents };
}

function updateEvent(state: AppState, newEvent: Event): EventsStateSlice {
  const {year, month} = getDateEntries(state.activeDate);
  const eventsState = Object.assign(state.events);
  const monthlyEvents = eventsState[year][month];
  const oldEventData = findEventByIndex(monthlyEvents, newEvent._id) as Event;
  const isEventsDateSame = moment(newEvent.startDate).isSame(moment(oldEventData.startDate), 'date');

  if (isEventsDateSame) {
    updateEventInState(oldEventData, newEvent);
    return { events: eventsState, activeDateEvents: state.activeDateEvents };
  } else {
    const {events, activeDateEvents} = deleteEventFromState(eventsState, oldEventData, state.activeDate);
    return { events: addEventToState(events, newEvent), activeDateEvents };
  }
}

function updateEventInState(oldEventData: Event, newEvent: Event): Event {
  Object.keys(oldEventData).forEach(
    key => oldEventData[key] = newEvent[key]
  );
  return oldEventData;
}

function findEventByIndex(storeEvents: GroupedEvents, index: string): Event|null {
  const monthlyEvents = Object.values(storeEvents);
  return monthlyEvents.reduce(
    (foundedEvent, {events}) => {
     const searchResult = events.find(item => item._id === index);
     return searchResult ? searchResult : foundedEvent;
    }, null
  ) as Event;
}

function getDateEntries(date: moment.Moment): DateEntries {
  return {
    year: date.year(),
    month: date.month(),
    dateStr: date.utc(true).format('YYYY-MM-DD'),
  };
}
