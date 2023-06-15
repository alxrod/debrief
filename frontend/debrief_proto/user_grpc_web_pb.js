/**
 * @fileoverview gRPC-Web generated client stub for communication
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.4.2
// 	protoc              v3.21.12
// source: debrief_proto/user.proto


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');


var debrief_proto_generic_pb = require('../debrief_proto/generic_pb.js')

var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js')
const proto = {};
proto.communication = require('./user_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.communication.AuthClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname.replace(/\/+$/, '');

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.communication.AuthPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname.replace(/\/+$/, '');

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.communication.UserRegisterRequest,
 *   !proto.communication.UserSigninResponse>}
 */
const methodDescriptor_Auth_Register = new grpc.web.MethodDescriptor(
  '/communication.Auth/Register',
  grpc.web.MethodType.UNARY,
  proto.communication.UserRegisterRequest,
  proto.communication.UserSigninResponse,
  /**
   * @param {!proto.communication.UserRegisterRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.communication.UserSigninResponse.deserializeBinary
);


/**
 * @param {!proto.communication.UserRegisterRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.communication.UserSigninResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.communication.UserSigninResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.communication.AuthClient.prototype.register =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/communication.Auth/Register',
      request,
      metadata || {},
      methodDescriptor_Auth_Register,
      callback);
};


/**
 * @param {!proto.communication.UserRegisterRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.communication.UserSigninResponse>}
 *     Promise that resolves to the response
 */
proto.communication.AuthPromiseClient.prototype.register =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/communication.Auth/Register',
      request,
      metadata || {},
      methodDescriptor_Auth_Register);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.communication.UserLoginRequest,
 *   !proto.communication.UserSigninResponse>}
 */
const methodDescriptor_Auth_Login = new grpc.web.MethodDescriptor(
  '/communication.Auth/Login',
  grpc.web.MethodType.UNARY,
  proto.communication.UserLoginRequest,
  proto.communication.UserSigninResponse,
  /**
   * @param {!proto.communication.UserLoginRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.communication.UserSigninResponse.deserializeBinary
);


/**
 * @param {!proto.communication.UserLoginRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.communication.UserSigninResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.communication.UserSigninResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.communication.AuthClient.prototype.login =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/communication.Auth/Login',
      request,
      metadata || {},
      methodDescriptor_Auth_Login,
      callback);
};


/**
 * @param {!proto.communication.UserLoginRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.communication.UserSigninResponse>}
 *     Promise that resolves to the response
 */
proto.communication.AuthPromiseClient.prototype.login =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/communication.Auth/Login',
      request,
      metadata || {},
      methodDescriptor_Auth_Login);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.communication.UserLogoutRequest,
 *   !proto.communication.NullResponse>}
 */
const methodDescriptor_Auth_Logout = new grpc.web.MethodDescriptor(
  '/communication.Auth/Logout',
  grpc.web.MethodType.UNARY,
  proto.communication.UserLogoutRequest,
  debrief_proto_generic_pb.NullResponse,
  /**
   * @param {!proto.communication.UserLogoutRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  debrief_proto_generic_pb.NullResponse.deserializeBinary
);


/**
 * @param {!proto.communication.UserLogoutRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.communication.NullResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.communication.NullResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.communication.AuthClient.prototype.logout =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/communication.Auth/Logout',
      request,
      metadata || {},
      methodDescriptor_Auth_Logout,
      callback);
};


/**
 * @param {!proto.communication.UserLogoutRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.communication.NullResponse>}
 *     Promise that resolves to the response
 */
proto.communication.AuthPromiseClient.prototype.logout =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/communication.Auth/Logout',
      request,
      metadata || {},
      methodDescriptor_Auth_Logout);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.communication.UserPullRequest,
 *   !proto.communication.UserEntity>}
 */
const methodDescriptor_Auth_Pull = new grpc.web.MethodDescriptor(
  '/communication.Auth/Pull',
  grpc.web.MethodType.UNARY,
  proto.communication.UserPullRequest,
  proto.communication.UserEntity,
  /**
   * @param {!proto.communication.UserPullRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.communication.UserEntity.deserializeBinary
);


/**
 * @param {!proto.communication.UserPullRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.communication.UserEntity)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.communication.UserEntity>|undefined}
 *     The XHR Node Readable Stream
 */
proto.communication.AuthClient.prototype.pull =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/communication.Auth/Pull',
      request,
      metadata || {},
      methodDescriptor_Auth_Pull,
      callback);
};


/**
 * @param {!proto.communication.UserPullRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.communication.UserEntity>}
 *     Promise that resolves to the response
 */
proto.communication.AuthPromiseClient.prototype.pull =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/communication.Auth/Pull',
      request,
      metadata || {},
      methodDescriptor_Auth_Pull);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.communication.ForgotRequest,
 *   !proto.communication.NullResponse>}
 */
const methodDescriptor_Auth_ForgotPassword = new grpc.web.MethodDescriptor(
  '/communication.Auth/ForgotPassword',
  grpc.web.MethodType.UNARY,
  proto.communication.ForgotRequest,
  debrief_proto_generic_pb.NullResponse,
  /**
   * @param {!proto.communication.ForgotRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  debrief_proto_generic_pb.NullResponse.deserializeBinary
);


/**
 * @param {!proto.communication.ForgotRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.communication.NullResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.communication.NullResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.communication.AuthClient.prototype.forgotPassword =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/communication.Auth/ForgotPassword',
      request,
      metadata || {},
      methodDescriptor_Auth_ForgotPassword,
      callback);
};


/**
 * @param {!proto.communication.ForgotRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.communication.NullResponse>}
 *     Promise that resolves to the response
 */
proto.communication.AuthPromiseClient.prototype.forgotPassword =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/communication.Auth/ForgotPassword',
      request,
      metadata || {},
      methodDescriptor_Auth_ForgotPassword);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.communication.ResetConfirmRequest,
 *   !proto.communication.ResetConfirmResponse>}
 */
const methodDescriptor_Auth_ConfirmResetId = new grpc.web.MethodDescriptor(
  '/communication.Auth/ConfirmResetId',
  grpc.web.MethodType.UNARY,
  proto.communication.ResetConfirmRequest,
  proto.communication.ResetConfirmResponse,
  /**
   * @param {!proto.communication.ResetConfirmRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.communication.ResetConfirmResponse.deserializeBinary
);


/**
 * @param {!proto.communication.ResetConfirmRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.communication.ResetConfirmResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.communication.ResetConfirmResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.communication.AuthClient.prototype.confirmResetId =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/communication.Auth/ConfirmResetId',
      request,
      metadata || {},
      methodDescriptor_Auth_ConfirmResetId,
      callback);
};


/**
 * @param {!proto.communication.ResetConfirmRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.communication.ResetConfirmResponse>}
 *     Promise that resolves to the response
 */
proto.communication.AuthPromiseClient.prototype.confirmResetId =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/communication.Auth/ConfirmResetId',
      request,
      metadata || {},
      methodDescriptor_Auth_ConfirmResetId);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.communication.ChangePasswordRequest,
 *   !proto.communication.UserSigninResponse>}
 */
const methodDescriptor_Auth_ChangePassword = new grpc.web.MethodDescriptor(
  '/communication.Auth/ChangePassword',
  grpc.web.MethodType.UNARY,
  proto.communication.ChangePasswordRequest,
  proto.communication.UserSigninResponse,
  /**
   * @param {!proto.communication.ChangePasswordRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.communication.UserSigninResponse.deserializeBinary
);


/**
 * @param {!proto.communication.ChangePasswordRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.communication.UserSigninResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.communication.UserSigninResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.communication.AuthClient.prototype.changePassword =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/communication.Auth/ChangePassword',
      request,
      metadata || {},
      methodDescriptor_Auth_ChangePassword,
      callback);
};


/**
 * @param {!proto.communication.ChangePasswordRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.communication.UserSigninResponse>}
 *     Promise that resolves to the response
 */
proto.communication.AuthPromiseClient.prototype.changePassword =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/communication.Auth/ChangePassword',
      request,
      metadata || {},
      methodDescriptor_Auth_ChangePassword);
};


module.exports = proto.communication;

