'use strict';

var domains = require('../../domains')
var studies = require('../../studies')
var utils = require('../../utils')

describe("Lindsey's Project", function(){

  it('aggregates studies by measures in a selected domain', function(){

    studies_with = {}
    for (study in studies){
      measures = study['measures']
      for (var i=0; i<measures.lengthl i++){
        measure = measures[i]
        if (measure in studies_with){
          studies_with[measure].push(study)
        }else{
          studies_with[measure] = [study]
        }
      }
    }

    var domain_element = element(by.model('domain'))
    var measures_elements = element.all(by.repeater('measure in measures'))
    var measure_name_elements = measure_elements.column('measure.name')
    var study_elements = element.all(by.repeater(
                           '(study_name, study) in measure.studies'))
    var study_name_elements = study_elements.column('study_name')

    for (domain in domains){
      domain_element.element(by.css(domain)).click()
      domain_measures = domains[domain]
      expect(utils.get_all_text(measure_name_elements))
        .toEqual(domain_measures)
      for (var i=0; i<domain_measures.length; i++){
        measure = domain_measures[i]
        expect(utils.get_all_text(study_name_elements))
          .toEqual(studies_with[measure])
      }
    }
  });
});
