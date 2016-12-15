const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaitShallowDeepEqual = require('chai-shallow-deep-equal');

chai.use(chaiAsPromised);
chai.use(chaitShallowDeepEqual);