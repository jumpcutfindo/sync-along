import RedisConnection from "../../connections/RedisConnection";
const redisClient = RedisConnection.getConnection();

export const getCurrentUser = async (id) => {
  return new Promise((resolve, reject) => {
    redisClient.get(`USER:${id}`, (err, reply) => {
      if (err) {
        reject(err);
      }
      try {
        const user = JSON.parse(reply);
        console.log(user)
        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  });
};
