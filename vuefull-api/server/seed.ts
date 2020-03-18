
import User from './api/user/user.model';
import Book from './api/book/model';
import Movie from './api/movie/model';
import Task from './api/task/model';
import Settings from './api/settings/model';

import usersInput from "./migrations/users";
import booksInput from "./migrations/books";
import moviesInput from "./migrations/movies";
import tasksInput from "./migrations/tasks";
import settingsInput from "./migrations/settings";

Settings.find(function (err, data) {
  if (!data || data.length < 1) {
    Settings.create(settingsInput, function (err, data) {
      Settings.find({}, function (err, data) { data.forEach(data => { data.save() }); })
      console.log('finished populating settings');
    });
  }
});

Task.find(function (err, data) {
  if (!data || data.length < 1) {
    Task.create(tasksInput, function (err, data) {
      Task.find({}, function (err, data) { data.forEach(data => { data.save() }); })
      console.log('finished populating tasks');
    });
  }
});
User.find(function (err, data) {
  if (!data || data.length < 1) {
    User.create(usersInput, function (err, data) {
      User.find({}, function (err, data) { data.forEach(data => { data.save() }); })
      console.log('finished populating users');
    });
  }
});

Book.find(function (err, data) {
  if (!data || data.length < 1) {
    Book.create(booksInput, function (err, data) {
      Book.find({}, function (err, data) { data.forEach(data => { data.save() }); })
      console.log('finished populating books');
    });
  }
});

Movie.find(function (err, data) {
  if (!data || data.length < 1) {
    Movie.create(moviesInput, function (err, data) {
      Movie.find({}, function (err, data) { data.forEach(data => { data.save() }); })
      console.log('finished populating movies');
    });
  }
});
