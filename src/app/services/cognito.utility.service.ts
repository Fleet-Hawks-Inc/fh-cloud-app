import { Injectable } from '@angular/core';
import Amplify, { Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CognitoUtility {

  /**
   * Constructor
   */
  constructor() {
    // Configure Amplify client
    Amplify.configure({
      Auth: {
        userPoolId: environment.congitoConfig.USER_POOL_ID,
        region: environment.congitoConfig.REGION,
        userPoolWebClientId: environment.congitoConfig.APP_CLIENT_ID
      }
    });

  }

  /**
   * Register the user
   */
  public registerUser = async (email: string, password: string, group: string, phoneNumber: string) => {
    try {
      const signUpResponse = await Auth.signUp({
        attributes: {
          email,
          phone_number: phoneNumber,
          group
        },
        password,
        username: email,
      });
      console.log(signUpResponse);
      return signUpResponse;

    } catch (error) {
      console.log(error);
      throw console.error;


    }
  }

  /**
   * SignIn User
   */
  public signInUser = async (emailPhoneNumber: string, password: string) => {

    await Auth.signIn({
      username: emailPhoneNumber,
      password
    });
  }

  public signOut = async () => {
    try {
      const signOutResponse = await Auth.signOut({
        global: false
      });
      console.log(signOutResponse);
      return signOutResponse;

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public changePassword = async (user: string, oldPassword: string, newPassword: string) => {
    try {
      const changePasswordResponse = await Auth.changePassword(user, oldPassword, newPassword);
      console.log(changePasswordResponse);
      return changePasswordResponse;

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public forgotPassword = async (userEmail: string) => {
    try {
      const forgotPasswordResponse = await Auth.forgotPassword(userEmail);

      console.log(forgotPasswordResponse);
      return forgotPasswordResponse;

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public forgotPasswordSubmitCode = async (userEmail, code: string, newPassword) => {
    try {
      const forgotPasswordResponse = await Auth.forgotPasswordSubmit(userEmail, code, newPassword);
      console.log(forgotPasswordResponse);
      return forgotPasswordResponse;

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public resendSignUpCode = async (username: string) => {
    try {
      await Auth.resendSignUp(username);
    } catch (error) {
      throw error;
    }
  }

  /**
   * returns a CognitoUserSession object which contains JWT accessToken, idToken, and refreshToken.
   */
  public getCurrentSession = async () => {
    const currentSession = Auth.currentSession();
    console.log(currentSession);
    return currentSession;
  }

}
