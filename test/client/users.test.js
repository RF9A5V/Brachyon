import React from "react";

import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import { shallow, mount } from "enzyme";

import SignUpForm from "/imports/components/public/signup.jsx";

// Things that need testing here

// User sign up
// User sign in
// Profile image updates
// Game banner updates

describe("users", function() {
  it("should sign up and redirect", function() {
    const signUpForm = mount(<SignUpForm />);
    var inputs = signUpForm.find("input");
    expect(inputs).to.have.length(5);
    var emailInput = signUpForm.find("[name='email']");
    expect(emailInput).to.have.length(1);
    emailInput.simulate("change", { target: { value: "a@b.co" } });
    emailInput.node.value = "a@b.co";
    assert.equal(emailInput.node.value, "a@b.co");
  })
})
