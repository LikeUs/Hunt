var basicAuth = new HttpBasicAuth(function(username, password) {
  return Meteor.settings.basicAuth.username == username && Meteor.settings.basicAuth.password == password;
});
basicAuth.protect(['/']);
