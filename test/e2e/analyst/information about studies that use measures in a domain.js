'use strict';

var domains = require('../../domains')
var studies = require('../../studies')
var utils = require('../../utils')

describe("Lindsey's Project", function(){

  beforeEach(function(){
    browser.get('')
  });

  var studies_with = {} //studies_with[measure]
  for (var study in studies){
    var measures = studies[study]['measures']
    for (var i=0; i<measures.length; i++){
      var measure = measures[i]
      if (measure in studies_with){
        studies_with[measure].push(study)
      }else{
        studies_with[measure] = [study]
      }
    }
  }

  var _test_studies_in_measure = function(measure, domain){
    it('lists each study in measure '+measure, function(){
      element(by.linkText(domain)).click()
      _find_measure_group(measure, function(measure_group){
        measure_group.all(
          by.repeater('(study_name, study) in studies[measure]')
        ).map(function(study_row){
          return study_row.element(by.binding('study_name')).getInnerHtml()
        }).then(function(study_names){
          expect(study_names.sort()).toEqual(studies_with[measure].sort())
        })
      })
    })
  }

  var _find_measure_group = function(measure, callback){
    element.all(by.repeater('measure in domains[selected_domain]')).each(
      function(measure_group){
        measure_group
          .element(by.css('.panel-title'))
          .element(by.binding('measure'))
          .getText()
          .then(function(measure_name){
            if (measure_name == measure){
              callback(measure_group)
            }
          })
       }
     )
  }

  it('lists all domains', function(){
    element.all(by.repeater('(domain_name, measures) in domains')).map(
      function(tab_element){
        return tab_element.element(by.binding('domain_name')).getText()
      }
    ).then(function(domain_tab_names){
      expect(domain_tab_names.sort()).toEqual(Object.keys(domains).sort())
    })
  })

  for (var domain in domains){

    it('lists each measure in domain '+domain, function(){
      element(by.linkText(domain)).click().then(function(){})
      element.all(by.repeater('measure in domains[selected_domain]')).map(
        function(measure_group){
          return measure_group
            .element(by.css('.panel-title'))
            .element(by.binding('measure'))
            .getText()
        }
      ).then(function(measure_names){
        expect(measure_names.sort()).toEqual(domains[domain].sort())
      });
    })

    domains[domain].forEach(function(measure){
      _test_studies_in_measure(measure, domain)
    });
  }

});
