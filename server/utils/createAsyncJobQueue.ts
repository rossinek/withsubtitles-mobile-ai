export function createAsyncJobQueue() {
  let activePromise: Promise<any> | null = null;
  const jobs: { handler: () => Promise<any>; resolve: (value: any) => void; reject: (error: any) => void }[] = [];
  function _tryStartNextJob() {
    if (activePromise) return;
    const job = jobs.shift();
    if (!job) return;
    activePromise = job.handler()
      .then(job.resolve)
      .catch(job.reject)
      .finally(() => {
        activePromise = null;
        _tryStartNextJob();
      });
  }

  function add<T>(job: () => Promise<T>) {
    let resolve: (value: any) => void;
    let reject: (error: any) => void;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    jobs.push({ handler: job, resolve: resolve!, reject: reject! });
    _tryStartNextJob();
    return promise as Promise<T>;
  }

  return { add };
}

export type AsyncJobQueue = ReturnType<typeof createAsyncJobQueue>;
