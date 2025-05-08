// Response Helpers. Every respose has 3 fields, one a response message, flag value to state

import { logger } from "./logger.mjs";

// if there is any payload and a payload field to store the corresponding data.
const Unauthorized = (res, msg = "Unauthorized Access!!!") => {
  logger.info("Unauthorized: %s", msg);
  return res.status(401).json({
    message: msg,
    flag: 0,
    payload: {},
  });
};

const SomethingWentWrong = (res, msg = "Something Went Wrong") => {
  logger.info("Something Went Wrong: %s", msg);
  return res.status(500).json({
    message: msg,
    flag: 0,
    payload: {},
  });
};

const Success = (res, payload = {}, msg = "Success") => {
  logger.info("Success, Message: %s", msg);
  return res.status(200).json({
    message: msg,
    flag: 1,
    payload: payload,
  });
};

const BadRequest = (res, msg = "Invalid Request!!!") => {
  logger.info("Bad Request: %s", msg);
  return res.status(400).json({
    message: msg,
    flag: 0,
    payload: {},
  });
};

const PageNotFound = (
  res,
  msg = "The Page you are looking for is not found"
) => {
  return res.status(404).json({
    message: msg,
    flag: 0,
    payload: {},
  });
};

export { Unauthorized, SomethingWentWrong, Success, BadRequest, PageNotFound };
