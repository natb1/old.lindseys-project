'use strict';

var domains = require('../../domains')
var studies = require('../../studies')
var utils = require('../../utils')

describe("Lindsey's Project", function(){

  beforeEach(function() {
    browser.get('')
  });

  it('aggregates studies by measures in a selected domain', function(){

    var studies_with = {}
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

    var domain_element = element(by.model('domain'))
    var measure_name_elements = element.all(
      by.repeater('measure in measures').column('measure.name'))
    var study_name_elements = element.all(
      by.repeater('(study_name, study) in measure.studies')
      .column('study_name'))

    for (var domain in domains){
      domain_element.element(by.css(domain)).click()
      var domain_measures = domains[domain]
      expect(utils.get_all_text(measure_name_elements))
        .toEqual(domain_measures)
      for (var i=0; i<domain_measures.length; i++){
        var measure = domain_measures[i]
        expect(utils.get_all_text(study_name_elements))
          .toEqual(studies_with[measure])
      }
    }
  });
});
