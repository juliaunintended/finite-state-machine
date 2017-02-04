class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
          if (!config) {
              throw new Error('config isn\'t passed');
          }
          this.config = config;
          this.statesStack = [];
          this.statesStack.push(this.config.initial);
          this.tempStack = [];
          this.enableRedo = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
          return this.statesStack[this.statesStack.length - 1];
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
          if (!this.config.states.hasOwnProperty(state)) {
              throw new Error('state isn\'t exist');
          } else {
              this.statesStack.push(state);
              this.enableRedo = false;
          }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
          if (!this.config.states[this.getState()].transitions.hasOwnProperty(event)) {
              throw new Error('state isn\'t exist');
          } else {
              this.changeState(this.config.states[this.getState()].transitions[event]);
              this.enableRedo = false;
          }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var states = [];

        if (!event) {
            return Object.keys(this.config.states);
        }
        for (var state in this.config.states) {
            if (event in this.config.states[state].transitions) {
                states.push(state);
            }
        }

        return states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.statesStack.length === 1) {
            return false;
        }

        this.tempStack.push(this.statesStack.pop());
        this.enableRedo = true;

        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this.tempStack.length || !this.enableRedo) {
            return false;
        }

        this.statesStack.push(this.tempStack.pop());

        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.statesStack = [this.config.initial];
        this.tempStack = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
