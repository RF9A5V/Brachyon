import React from "react";

import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import { shallow, mount } from "enzyme";

import SignUpForm from "/imports/components/public/signup.jsx";
import LogInForm from "/imports/components/public/login.jsx";

// Things that need testing here

// User sign up
// User sign in
// Profile image updates
// Game banner updates

describe("users", function(done) {

  beforeEach(function(done) {
    resetDatabase();
    done();
  })

  it("should sign up and redirect", function() {
    const signUpForm = mount(<SignUpForm />);
    var inputs = signUpForm.find("input");
    expect(inputs).to.have.length(5);
    var emailInput = signUpForm.find("[name='email']");
    expect(emailInput).to.have.length(1);
    emailInput.simulate("change", { target: { value: "a@b.co" } });
    emailInput.node.value = "a@b.co";
    assert.equal(emailInput.node.value, "a@b.co");
  });

  it("should log in and redirect with email", function() {
    Meteor.call("users.create", "steven@brachyon.com", "eyewumbo", "password");
    const logInForm = mount(<LogInForm />);
    var inputs = logInForm.find("input");
    expect(inputs).to.have.length(3);
    var emailInput = logInForm.find("[name='email']");
    emailInput.node.value = "steven@brachyon.com";
    var passInput = logInForm.find("[name='password']");
    passInput.node.value = "password";
    assert.equal(emailInput.node.value, "steven@brachyon.com");
    assert.equal(passInput.node.value, "password");
  })

})
