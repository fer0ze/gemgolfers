import gql from 'graphql-tag';

export const    LogQL = gql`
    query cloudLoggingAction($request: RequestInput!) {
        googleCloudLogging(request: $request) {
            message
            status
        }
    }
`;
