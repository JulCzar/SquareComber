/**
 * The following code was take from stack overflow, over the link: https://stackoverflow.com/questions/6921895/synchronous-delay-in-code-execution
 * 
 * this function will return a promise that will take the number of ms passed as param to resolve
 * @param {number} ms time in milliseconds to wait
 */
export const wait = ms => new Promise((resolve, reject) => {
  setTimeout(resolve, ms )
})


/**
 * Run an callback after some time 
 * @param {() => {}} callback function that will be executed after the delay
 * @param {number} ms delay in milliseconds
 */
export const doAfter = async (callback, ms) => {
  await wait(ms)

  callback()
}