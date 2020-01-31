<?php


class DetectNewBlocksCest
{
    public function _before(AcceptanceTester $I)
    {
    }

    public function _after(AcceptanceTester $I)
    {
    }

    public function checkNewBlocks(AcceptanceTester $I)
    {
        $I->wantTo('Check if new blocks are detected');

        $I->loginAsAdmin('admin', 'password');

        $I->deactivatePlugin('test-block');

        $I->amOnPage('/wp-admin/post-new.php');

        // Hide the Tips popup
        try {
            $I->waitForElementVisible('.edit-post-welcome-guide');
            $I->clickWithLeftButton('//button[@aria-label="Close dialog"]');
        } catch (Exception $e) {
            //not latest Gutenberg
        }
        try {
            $I->executeJS('wp.data.dispatch( "core/nux" ).disableTips()');
        } catch (Exception $e) {}

        // Click on + button
        $I->click('.edit-post-header-toolbar .block-editor-inserter button');

        // Search for Test
        $I->waitForElement('.block-editor-inserter__popover .components-popover__content');
        $I->wait(0.2); // wait the animation done
        $I->fillField(['xpath'=>'//input[contains(@id, \'block-editor-inserter__search-\')]'], 'Test');

        $I->dontSee("Test block");

        $I->activatePlugin('test-block');

        // Go to new post page
        $I->amOnPage('/wp-admin/post-new.php');
        $I->click('.edit-post-header-toolbar .block-editor-inserter button');
        $I->waitForElement('.block-editor-inserter__popover .components-popover__content');
        $I->wait(0.2); // wait the animation done
        $I->fillField(['xpath'=>'//input[contains(@id, \'block-editor-inserter__search-\')]'], 'Test');

        $I->see("Test block");

        $I->deactivatePlugin('test-block');
    }
}