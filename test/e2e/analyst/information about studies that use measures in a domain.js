'use strict';

var domains = require('../../domains')
var studies = require('../../studies')
var utils = require('../../utils')

describe("Lindsey's Project", function(){

  beforeEach(function() {
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

  var domain_elements = element.all(
    by.repeater('(domain_name, measures) in domains'))
  var measure_elements = element.all(
    by.repeater('measure in domains[selected_domain]'))

  it('enumerates all domains for selection', function(){
    domain_elements.map(function(tab_element){
      var tab_name = tab_element.element(by.binding('domain_name')).getText()
      return tab_name
    }).then(function(domain_tab_names){
      expect(domain_tab_names.sort()).toEqual(Object.keys(domains).sort())
    })
  })

  it('lists all measures in a selected domain', function(){
    domain_elements.each(function(tab_element){
      var domain_name_element = tab_element.element(by.binding('domain_name'))
      domain_name_element.click()
      domain_name_element.getText().then(function(domain_name){
        measure_elements.map(function(measure_group){
          var measure_nm = measure_group.element(by.binding('measure')).getText()
          return measure_nm
        }).then(function(measure_names){
          expect(measure_names.sort()).toEqual(domains[domain_name].sort())
        })
      })
    });
  });

  it('lists all studies in a selected measure', function(){
    //expect each measure to have correct list of studies
  });

});
