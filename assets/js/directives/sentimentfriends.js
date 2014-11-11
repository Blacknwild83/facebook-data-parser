angular.module('sentimentFriends', ['facebook-factory'])
  .directive('sentimentFriends', function(facebookdata) {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'assets/js/templates/sentiment.html',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.value, function(newValue) {
          if (newValue) {
            var messageMoods = [];
            for (var userName in newValue.userMessages) {
              var user = newValue.userMessages[userName];
              if (user.hasOwnProperty('average')) {
                var messageTotal = user.messages.length;
                user.average = Math.round(user.average * 100) / 100;
                timestampCount = {};
                user.messages[userName];
                for (var count in user.messages) {
                  var timestamp = user.messages[count].timestamp;
                  var stamp = moment(timestamp, ['MMM D YYYY at h:mA']).valueOf();
                  timestampCount[stamp] ? timestampCount[stamp] ++ : timestampCount[stamp] = 1;
                }
                messageMoods.push([userName, user.average, messageTotal, timestampCount]);
              }
            }
            messageMoods.sort(function(a, b) {
              return a[2] - b[2]
            });
            messageMoods.length > 150 ? topFriends = messageMoods.slice(messageMoods.length - 150, messageMoods.length) : topFriends = messageMoods;
            topFriends.sort(function(a, b) {
              return a[1] - b[1]
            });
            var len = topFriends.length;
            var negative = {
              "key": "Negative",
              "color": "#F3313A",
              "values": []
            };
            var positive = {
              "key": "Positive",
              "color": "#4F6DA0",
              "values": []
            };
            var negative20 = topFriends.slice(0, 20);
            for (var user in negative20) {
              negative["values"].push({
                label: topFriends[user][0],
                value: negative20[user][1]
              })
            }
            topFriends.reverse();
            var positive20 = topFriends.slice(0, 20);
            for (var user in positive20) {
              positive["values"].push({
                label: topFriends[user][0],
                value: positive20[user][1]
              })
            }
            var negativeChart = [];
            var positiveChart = [];
            negativeChart.push(negative);
            positiveChart.push(positive);
            nv.addGraph(function() {
              var chart = nv.models.multiBarHorizontalChart()
                .x(function(d) {
                  return d.label
                })
                .y(function(d) {
                  return d.value
                })
                .margin({
                  top: 30,
                  right: 20,
                  bottom: 50,
                  left: 175
                })
                .showValues(false) //Show bar value next to each bar.
                .tooltips(true) //Show tooltips on hover.
                .transitionDuration(350)
                .showControls(false); //Allow user to switch between "Grouped" and "Stacked" mode.
              chart.yAxis
                .tickFormat(d3.format(',.2f'));
              d3.select('#negative svg')
                .datum(negativeChart)
                .call(chart);
              nv.utils.windowResize(chart.update);
              return chart;
            });
            nv.addGraph(function() {
              var chart = nv.models.multiBarHorizontalChart()
                .x(function(d) {
                  return d.label
                })
                .y(function(d) {
                  return d.value
                })
                .margin({
                  top: 30,
                  right: 20,
                  bottom: 50,
                  left: 175
                })
                .showValues(false) //Show bar value next to each bar.
                .tooltips(true) //Show tooltips on hover.
                .transitionDuration(350)
                .showControls(false); //Allow user to switch between "Grouped" and "Stacked" mode.
              chart.yAxis
                .tickFormat(d3.format(',.2f'));
              d3.select('#positive svg')
                .datum(positiveChart)
                .call(chart);
              nv.utils.windowResize(chart.update);
              return chart;
            });
          }
        })
      }
    }
  })
