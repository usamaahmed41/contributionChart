
//Format string
if (!String.prototype.formatString) {
  String.prototype.formatString = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) {
          return typeof args[number] != 'undefined' ?
              args[number] :
              match;
      });
  };
}

(function($)
{
  $.fn.contribution_graph = function(options) {
      var time_frame = options.chartData.duration;
      var no_of_cols = options.chartData.duration / options.chartData.step;
      var start_time = options.chartData.startTime;
      var end_time = start_time + time_frame;
      var users;
      var action_def;
      var print;


      var checkforaction = function(time)
{
          if (time <= options.chartData.step) {
              return 1;
          } else {
              var box = Math.floor(time / options.chartData.step);
              box= box +1;
              return box;
          }
      }

      var getColor = function(action, i) {
          i = i % (settings.colors.length);
          console.log("getting color :", action, i);
          let colorPallet = settings.colors[i];
          return colorPallet[action];
      }

      var start = function() {
          var wrap_chart = _this;
          var loop_html = "";

          //One year has 52 weeks
          var step = options.chartData.boxSize;
          var no_of_users = options.chartData.logs.length;

          for (var i = 0; i < no_of_users; i++) {
              var g_x = i * step;
              var item_html = '<g transform="translate(0,' + g_x.toString() + ')">';
              var l = 0;
              var boxarr = [];
                  var actionarr = [];
                  if (start_time <= end_time) {
                      users = options.chartData.logs[i];
                      for (var k = 0; k < users.activity.length; k++) {
                          var activity = users.activity[k];
                          var time = activity.time;
                          var action = activity.action;
                          action_def = action;
                          var priority;
                          for (var m = 0; m < options.chartData.priority.length; m++) {
                              if (
                                  options.chartData.priority[m] == action) {
                                  priority = m;
                              }
                          }

                          var box = checkforaction(time);
                          actionarr.push(priority + 1);
                          boxarr.push(box);
                      }

                  }

              for (var j = 0; j < no_of_cols; j++) {

                  var y = j * step;
                  var color;
                  var boxaction = '';
                  var run =0;
                  if (j != boxarr[l]-1) {
                  var action = 0;
                  color = getColor(action, i); 
              } else {
                  color = getColor(actionarr[l], i);
                  var actionIndex = actionarr[l] - 1
                  if (actionIndex > -1) {
                      boxaction = options.chartData.priority[actionIndex];
                  }
                  if(l<boxarr.length)
                  {
                    if(j==boxarr[l+1]-1)
                    {
                      j--;
                    }
                  }
                   l++;   
              }
                item_html += '<rect class="time" width="' + (step - 2) + '" height="' + (step - 2) + '" x="' + y + '" fill="' + color + '" user="' + users.user + '"action="' + boxaction + '"/>';       
               
              }

              item_html += "</g>";

              loop_html += item_html;

          }

          var graph_height = (options.chartData.logs.length * options.chartData.boxSize) + 40
          var wire_html =
              '<svg width="280" height="' + graph_height + '" class="js-calendar-graph-svg" id="contribution-graph">' +
              '<g transform="translate(20, 20)">' +
              loop_html +
              '</g>' +
              '</svg>';

          wrap_chart.html(wire_html);


          _this.find('rect').on("mouseenter", mouseEnter);
          _this.find('rect').on("mouseleave", mouseLeave);
          appendTooltip();

      }

      var mouseLeave = function(evt) {
          $('.svg-tip').hide();
      }

      var mouseEnter = function(evt) {

              var target_offset = $(evt.target).offset();
              var user = $(evt.target).attr('user');
              var action = $(evt.target).attr('action');

              var text = "{0} : {1}".formatString(user, action);

              var svg_tip = $('.svg-tip').show();
              svg_tip.html(text);
              var svg_width = Math.round(svg_tip.width() / 2 + 5);
              var svg_height = svg_tip.height() * 2 + 10;

              svg_tip.css({ top: target_offset.top - svg_height - 5 });
              svg_tip.css({ left: target_offset.left - svg_width });
          }
          //Append tooltip to display when mouse enter the rect element
          //Default is display:none
      var appendTooltip = function() {
          if ($('.svg-tip').length == 0) {
              $('body').append('<div class="svg-tip svg-tip-one-line" style="display:none" ></div>');
          }
      }

      var settings = $.extend({
          //Default init settings.colors, user can override
          colors: [
              ['#eeeeee', '#2874A6', '#2E86C1', '#3498DB', '#5DADE2', '#85C1E9', '#AED6F1'],
              ['#eeeeee', '#76448A', '#884EA0', '#9B59B6', '#AF7AC5', '#C39BD3', '#D7BDE2'],
              ['#eeeeee', '#148F77', '#17A589', '#1ABC9C', '#48C9B0', '#48C9B0', '#A3E4D7'],
              ['#eeeeee', '#B03A2E', '#CB4335', '#E74C3C', '#EC7063', '#F1948A', '#F5B7B1']
          ],
          texts: ['', '']

      }, options);

      var _this = $(this);

      start();

  };

}(jQuery));