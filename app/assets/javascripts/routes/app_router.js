EdgeAgility.Router = Ember.Router.extend({
  enableLogging: true,
  location: 'hash',

  root: Ember.Route.extend({
    index: Ember.Route.extend({
      route: '/'

      // You'll likely want to connect a view here.
      // connectOutlets: function(router) {
      //   router.get('applicationController').connectOutlet(App.MainView);
      // }

      // Layout your routes here...
    }),
    backlog:  Ember.Route.extend({
      route: '/backlog',
      enter: function (router) {
        console.log("The backlog sub-state was entered.");
      },
      showNewIteration: function(router) {
        router.transitionTo('backlog.newIteration', {});
      },
      connectOutlets: function(router, context) {
        router.get('applicationController').connectOutlet({
          viewClass: EdgeAgility.BacklogView,
          controller: router.get('backlogController'),
          context: EdgeAgility.store.findAll(EdgeAgility.Iteration)
        });
      },
      index: Ember.Route.extend({
        route: '/',
        enter: function (router) {
          console.log("The backlog index sub-state was entered.");
        },
        connectOutlets: function(router, context) {
          router.get('backlogController').connectOutlet({
            outletName: 'quickBar',
            viewClass: EdgeAgility.QuickUserStoryView,
            controller: router.get('quickUserStoryController')
          });
          router.get('quickUserStoryController').enterNew();
        }
      }),
      newIteration: Ember.Route.extend({
        route: '/new-iteration',
        cancelNewIteration: function(router) {
          router.transitionTo('backlog.index');
        },
        connectOutlets: function(router, context) {
          router.get('backlogController').connectOutlet({
            outletName: 'newIteration',
            viewClass: EdgeAgility.NewIterationView,
            controller: router.get('newIterationController')
          });
          router.get('newIterationController').enterNew();
        }
      })
    }),
    userStories:  Ember.Route.extend({
      route: '/user_stories',
      showNewUserStory: function(router) {
        router.transitionTo('userStories.new', {});
      },
      editUserStory: function(router, event) {
        router.transitionTo('userStories.edit', event.context);
      },
      destroyUserStory: function(router, event) {
        event.context.deleteRecord();
        EdgeAgility.store.commit();
        router.transitionTo('userStories.index');
      },
      enter: function (router) {
        console.log("The user_stories sub-state was entered.");
      },
      connectOutlets: function(router, context) {
        router.get('applicationController').connectOutlet("userStories", EdgeAgility.store.findAll(EdgeAgility.UserStory));
      },
      index: Ember.Route.extend({
          route: '/',
          enter:  function(router) {
            console.log("The user_stories index sub-state was entered.");
          },
          connectOutlets: function(router, context) {
            router.get('applicationController').connectOutlet("userStories");
          }
      }),
      show: Ember.Route.extend({
          route: '/:user_story_id',
          connectOutlets: function(router, context) {
            router.get('applicationController').connectOutlet('showUserStories');
          }
      }),
      edit: Ember.Route.extend({
          route: '/:user_story_id/edit',
          enter: function(router) {
            
          },
          cancelEdit: function(router) {
            router.transitionTo('userStories.index');
          },
          connectOutlets: function(router, context) {
            var userStoriesController = router.get('userStoriesController');
            userStoriesController.connectOutlet('editUserStory', context);
            router.get('editUserStoryController').enterEdit();       
          },
          exit: function(router) {
            router.get('editUserStoryController').exitEdit();
          }
      }),
      new: Ember.Route.extend({
          route: '/new',
          cancelNew: function(router) {
            router.transitionTo('userStories.index');
          },
          connectOutlets: function(router, context) {
            router.get('userStoriesController').connectOutlet('newUserStory');
            router.get('newUserStoryController').enterNew();
          }
      })
    })
  })
});