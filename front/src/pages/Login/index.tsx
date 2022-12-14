import axios from 'axios';
import useInput from '../../../../front/src/hooks/useInput';
import fetcher from '../../../../front/src/utils/fetch';
import React, { useCallback, useState } from 'react';
import { Redirect } from 'react-router-dom';
import useSWR from "swr";
import {Button, Form, Header, Input, Label, LinkContainer} from '../SignUp/style';

const LogIn = () => {
    const { data, error, revalidate,mutate } = useSWR('http://localhost:3095/api/users', fetcher);
    const [logInError, setLogInError] = useState(false);
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');
    const onSubmit = useCallback(
        (e:any) => {
            e.preventDefault();
            setLogInError(false);
            axios
                .post(
                    'http://localhost:3095/api/users/login',
                    { email, password },
                    {
                        withCredentials: true,
                    },
                )
                .then((res) => {
                    mutate(res.data, false);
                })
                .catch((error) => {
                    setLogInError(error.response?.data?.code === 401);
                });
        },
        [email, password],
    );

    if(data === undefined){
        return <div>로딩중 ...</div>
    }

    if(data){
        return <Redirect to={"/workspace/sleact/channel/일반"}/>;
    }

    // console.log(error, userData);
    // if (!error && userData) {
    //   console.log('로그인됨', userData);
    //   return <Redirect to="/workspace/sleact/channel/일반" />;
    // }

    return (
        <div id="container">
            <Header>로그인</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>이메일 주소</span>
                    <div>
                        <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
                    </div>
                </Label>
                <Label id="password-label">
                    <span>비밀번호</span>
                    <div>
                        <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
                    </div>
                    {/*{logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}*/}
                </Label>
                <Button type="submit">로그인</Button>
            </Form>
            <LinkContainer>
                아직 회원이 아니신가요?&nbsp;
                <a href="/signup">회원가입 하러가기</a>
            </LinkContainer>
        </div>
    );
};

export default LogIn;
