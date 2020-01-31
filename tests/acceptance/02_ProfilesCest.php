<?php


class ProfilesCest
{
    public function _before(AcceptanceTester $I)
    {
    }

    public function _after(AcceptanceTester $I)
    {
    }

    public function deactivateProfileBlocks(AcceptanceTester $I)
    {
        $I->loginAsAdmin('admin', 'password');

        $I->wantTo('Check if hidden profile blocks are not available in post edition anymore');

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

        $I->waitForElement('.block-editor-inserter__popover .components-popover__content');
        $I->wait(0.2); // wait for animation done

        // Search for Count Up block
        $I->fillField(['xpath'=>'//input[contains(@id, \'block-editor-inserter__search-\')]'], 'Count');

        // Search count up block
        $I->see("Count Up");

        // Advanced Gutenberg page
        $I->amOnPage('wp-admin/admin.php?page=advgb_main');

        // Profiles management page
        $I->click(['xpath' => '//ul[contains(@class, \'ju-menu-tabs\')]//a[contains(@href,\'#profiles\')]']);

        // Go to profiles management page
        $I->see('Advanced Gutenberg Profiles');

        // Edit default profile
        $I->click('.profile-title a');

        $I->see('Edit Profile');

        $I->fillField('//input[contains(@class,"blocks-search-input")]', 'Count Up');

        // Switch off Count Up block
        $I->click(['xpath'=>'//li[contains(@data-type, \'advgb/count-up\')]//label[contains(@class,\'switch\')]']);

        // Save
        $I->click('Save');

        $I->see('Profile saved successfully! ');

        // New post page
        $I->amOnPage('/wp-admin/post-new.php');

        // Click on + button
        $I->click('.editor-inserter button');
        $I->waitForElement('.block-editor-inserter__popover .components-popover__content');
        $I->wait(0.2); // wait for animation done

        // Search for Count up block
        $I->fillField(['xpath'=>'//input[contains(@id, \'block-editor-inserter__search-\')]'], 'Count');

        // I should not see count up anymore
        $I->dontSee("Count Up");

        // Switch back block to on
        // Advanced Gutenberg page
        $I->amOnPage('wp-admin/admin.php?page=advgb_main');

        // Profiles management page
        $I->click(['xpath' => '//ul[contains(@class, \'ju-menu-tabs\')]//a[contains(@href,\'#profiles\')]']);

        // Go to profiles management page
        $I->see('Advanced Gutenberg Profiles');

        // Edit default profile
        $I->click('.profile-title a');

        $I->see('Edit Profile');

        // Search Count Up block
        $I->fillField('.//input[contains(@class,"blocks-search-input")]', 'Count Up');

        // Switch off Count Up block
        $I->click(['xpath'=>'//li[contains(@data-type, \'advgb/count-up\')]//label[contains(@class,\'switch\')]']);

        // Save
        $I->click('Save');

    }
}