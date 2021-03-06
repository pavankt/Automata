/* eslint-disable no-undef */
const assert = require('chai').assert;
const _ = require('underscore')._;
const NFA = require('../src/NFA.js');

describe('#NFA', () => {
	describe('#NFA which accepts sting with alternate characters beginning and ending with same letter', () => {
		let nfa;
		before(() => {
			nfa = new NFA({
				'states': ['q1', 'q3', 'q7', 'q2', 'q5', 'q6', 'q4'],
				'alphabets': [
					'1',
					'0'
				],
				'transitionFunction': {
					'q1': {
						'e': ['q2', 'q5']
					},
					'q2': {
						'0': ['q3']
					},
					'q3': {
						'1': ['q4']
					},
					'q4': {
						'0': ['q3']
					},
					'q5': {
						'1': ['q6']
					},
					'q6': {
						'0': ['q7']
					},
					'q7': {
						'1': ['q6']
					}
				},
				'startingState': 'q1',
				'acceptableStates': ['q3', 'q6']
			});
		});

		describe('addEpsilon', () => {
			it('should add states to current states without any input if epsilon transition is present', () => {
				let currentStates = ['q1'];
				let expected = ['q1', 'q2', 'q5'];

				nfa.addEpsilons(currentStates);
				assert.deepEqual(currentStates, expected);
			});

			it('should not add any states to current states if epsilon transition is not present', () => {
				let currentStates = ['q2'];

				nfa.addEpsilons(currentStates);
				assert.ok(!_.isEmpty(currentStates));
			});
		});

		describe('changeState', () => {
			it('should return q3 in an array when passed q2 as state and 0 as alphabet', function () {
				assert.deepEqual(nfa.changeState('q2', 0), ['q3']);
			});

			it('should return undefined in an array when passed q3 as state and 1 as alphabet', function () {
				assert.isNotOk(nfa.changeState('q2', 1));
			});

			it('should return ["q2", "q5"] in an array when passed q1 as state and e as alphabet', function () {
				assert.deepEqual(nfa.changeState('q1', 'e'), ['q2', 'q5']);
			});
		});

		describe('Pass cases', () => {
			it('should accept the string 101', () => {
				assert.ok(nfa.doesAccept('101'));
			});

			it('should accept the string 10101', () => {
				assert.ok(nfa.doesAccept('10101'));
			});

			it('should accept the string 1010101', () => {
				assert.ok(nfa.doesAccept('1010101'));
			});

			it('should accept the string 01010', () => {
				assert.ok(nfa.doesAccept('01010'));
			});

			it('should accept the string 0101010', () => {
				assert.ok(nfa.doesAccept('0101010'));
			});
		});

		describe('Fail cases', () => {
			it('should not accept the string 10', () => {
				assert.ok(!nfa.doesAccept('10'));
			});

			it('should not accept the string with consequent alphabets', () => {
				assert.ok(!nfa.doesAccept('1001'));
			});

			it('should not accept the string with alternative alphabets but not ending with the starting alphabet', () => {
				assert.ok(!nfa.doesAccept('101010'));
			});
		});
	});
});

