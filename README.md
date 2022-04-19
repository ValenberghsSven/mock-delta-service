# mock-delta-service
Service for receiving and discarding deltas

Some services with deltas should not be running locally, but delta's are being sent even if the services are disabled.
This causes problems that slow down the stack, mainly cache invalidations takes much longer when delta's can't be sent.